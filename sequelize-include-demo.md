# Sequelize `include` — Eager Loading (JOINs)

`include` is how you load associated rows in the **same query** as the main row.
Under the hood Sequelize turns it into a SQL `JOIN`, so you don't write raw SQL.

This assumes the associations from `sequelize-associations-demo.md` are already
defined in `models/index.js`:

```js
Films.hasMany(Showtimes,  { foreignKey: 'filmId', as: 'showtimes' });
Showtimes.belongsTo(Films, { foreignKey: 'filmId', as: 'film' });

Users.hasMany(Bookings,    { foreignKey: 'userId',     as: 'bookings' });
Bookings.belongsTo(Users,  { foreignKey: 'userId',     as: 'user' });

Showtimes.hasMany(Bookings,   { foreignKey: 'showtimeId', as: 'bookings' });
Bookings.belongsTo(Showtimes, { foreignKey: 'showtimeId', as: 'showtime' });
```

> The `as` alias you set on the association is **exactly** the value you pass to
> `include` and the key you read on the result.

---

## 1. The basic shape

```js
import { Films, Showtimes } from '../models/index.js';

// film + all of its showtimes (one query)
const film = await Films.findByPk(1, {
  include: { model: Showtimes, as: 'showtimes' },
});

film.showtimes.forEach(s => console.log(s.showDate, s.price));
```

Without `include` you'd run two queries (find the film, then find its showtimes).
With `include` it's one JOIN:

```sql
SELECT films.*, showtimes.*
FROM films
LEFT OUTER JOIN showtimes ON showtimes.filmId = films.id
WHERE films.id = 1;
```

---

## 2. Multiple includes

Pass an **array** to load several associations at once.

```js
const showtime = await Showtimes.findByPk(10, {
  include: [
    { model: Films,    as: 'film' },
    { model: Bookings, as: 'bookings' },
  ],
});

console.log(showtime.film.title);
console.log(showtime.bookings.length);
```

---

## 3. Nested includes (JOIN through several tables)

You can nest `include` to walk the chain: a user → their bookings → each booking's
showtime → that showtime's film.

```js
const user = await Users.findByPk(1, {
  include: {
    model: Bookings,
    as: 'bookings',
    include: {
      model: Showtimes,
      as: 'showtime',
      include: { model: Films, as: 'film' },
    },
  },
});

user.bookings.forEach(b =>
  console.log(b.showtime.film.title, '@', b.showtime.showTime)
);
```

---

## 4. Picking columns and filtering the included rows

- **`attributes`** — limit which columns come back (less data over the wire).
- **`where` inside an include** — filter the joined table.
- **`required: true`** — turns the `LEFT JOIN` into an `INNER JOIN`, so only main
  rows that *have* a matching included row are returned.

```js
const films = await Films.findAll({
  attributes: ['id', 'title'],
  include: {
    model: Showtimes,
    as: 'showtimes',
    attributes: ['showDate', 'price'],
    where: { showDate: '2026-06-10' }, // only that day's showtimes
    required: true,                    // INNER JOIN: drop films with no match
  },
});
```

`required: true` is the difference between "all films, showtimes if any"
(`LEFT JOIN`) and "only films that actually have a showtime on that date"
(`INNER JOIN`).

---

## 5. Filtering the main row by an included value

Move the include's `where` together with `required: true` when you want to filter the
**main** table by something on the joined table — e.g. "users who have at least one
confirmed booking":

```js
const users = await Users.findAll({
  include: {
    model: Bookings,
    as: 'bookings',
    where: { status: 'confirmed' },
    required: true, // only users with a confirmed booking
  },
});
```

This is the JOIN-based "has the user watched/booked?" check the assignment asks for.

---

## 6. Ordering and limiting

Order can reference an included model by listing the alias first.

```js
const films = await Films.findAll({
  include: { model: Showtimes, as: 'showtimes' },
  order: [
    ['title', 'ASC'],
    [{ model: Showtimes, as: 'showtimes' }, 'showDate', 'ASC'],
  ],
});
```

> Be careful combining `include` with `limit`. When the main row has many included
> rows, Sequelize may apply the limit through a subquery — read the result, and if the
> counts look off, fetch IDs first, then load with `include`.

---

## 7. Quick reference

| Goal                                   | Option                                |
|----------------------------------------|---------------------------------------|
| Load one association                   | `include: { model, as }`              |
| Load several                           | `include: [ {…}, {…} ]`               |
| Go through multiple tables             | nest `include` inside `include`       |
| Pick columns from the joined table     | `attributes: [...]` inside the include|
| Filter the joined rows                 | `where: {...}` inside the include     |
| INNER JOIN (drop rows with no match)   | `required: true`                      |
| Filter main row by a joined value      | `where` + `required: true`            |

Rule of thumb: **`include` = JOIN.** Pass the model and its `as` alias, and read the
data back on that same alias.

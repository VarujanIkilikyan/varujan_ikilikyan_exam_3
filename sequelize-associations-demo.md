# Sequelize Associations — `hasMany` & `belongsTo`

A short, copy-pasteable demo of one-to-many associations in Sequelize, written in the
same style as the `express-app` codebase (ES modules, class-based `Model.init`,
shared `db` from `clients/db.sequelize.js`).

We model two tables from the assignment:

- **One `Film` has many `Showtime`s** → `Film.hasMany(Showtime)`
- **Each `Showtime` belongs to one `Film`** → `Showtime.belongsTo(Film)`

These two always come as a **pair**: `hasMany` lives on the "one" side, `belongsTo`
lives on the "many" side. The foreign key (`filmId`) lives on the **many** side
(`showtimes` table).

```
films (one)                 showtimes (many)
┌────────────┐              ┌────────────────────┐
│ id (PK)    │◄────────────┤ filmId (FK)         │
│ title      │   1     ∞    │ id (PK)             │
│ genre      │              │ showDate / showTime │
└────────────┘              │ price               │
                            └────────────────────┘
```

---

## 1. The models

### `models/Films.js`

```js
import { DataTypes, Model } from 'sequelize';
import db from '../clients/db.sequelize.js';

class Films extends Model {}

Films.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.BIGINT, // minutes
  },
}, {
  sequelize: db,
  modelName: 'films',
  tableName: 'films',
  timestamps: true,
});

export default Films;
```

### `models/Showtimes.js`

```js
import { DataTypes, Model } from 'sequelize';
import db from '../clients/db.sequelize.js';

class Showtimes extends Model {}

Showtimes.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  showDate: {
    type: DataTypes.DATEONLY,
  },
  showTime: {
    type: DataTypes.TIME,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  // filmId is added automatically by the association below —
  // you do NOT need to declare it here.
}, {
  sequelize: db,
  modelName: 'showtimes',
  tableName: 'showtimes',
  timestamps: true,
});

export default Showtimes;
```

---

## 2. Declaring the association

Associations go in `models/index.js`, **after** every model is imported, so that all
models exist before we link them.

### `models/index.js`

```js
import Films from './Films.js';
import Showtimes from './Showtimes.js';

// One film has many showtimes
Films.hasMany(Showtimes, {
  foreignKey: 'filmId', // column created on the showtimes table
  as: 'showtimes',      // alias used in include / when reading the data
});

// Each showtime belongs to one film
Showtimes.belongsTo(Films, {
  foreignKey: 'filmId',
  as: 'film',
});

export { Films, Showtimes };
```

What each option does:

- **`foreignKey: 'filmId'`** — the column on the **many** side (`showtimes.filmId`)
  that points back to `films.id`. If you omit it, Sequelize invents one for you;
  naming it explicitly keeps both sides in sync.
- **`as: '...'`** — the alias you use later in `include` and on the returned object.
  Use a plural alias for `hasMany` (`showtimes`) and a singular one for `belongsTo`
  (`film`).

> Run `await db.sync()` (or your migration) once after adding the association so the
> `filmId` column actually gets created on the `showtimes` table.

---

## 3. Querying across the association (the JOIN)

`include` is how Sequelize performs the SQL **JOIN** for you.

### Read the "one" with its "many" — film + all its showtimes

```js
import { Films, Showtimes } from '../models/index.js';

const film = await Films.findByPk(1, {
  include: { model: Showtimes, as: 'showtimes' },
});

console.log(film.title);          // "Dune"
console.log(film.showtimes.length); // e.g. 3
console.log(film.showtimes[0].price);
```

Sequelize runs roughly:

```sql
SELECT films.*, showtimes.*
FROM films
LEFT JOIN showtimes ON showtimes.filmId = films.id
WHERE films.id = 1;
```

### Read the "many" with its "one" — showtime + its film

```js
const showtime = await Showtimes.findByPk(10, {
  include: { model: Films, as: 'film' },
});

console.log(showtime.film.title); // the parent film, via belongsTo
```

### List every showtime with its film title

```js
const showtimes = await Showtimes.findAll({
  include: { model: Films, as: 'film' },
  order: [['showDate', 'ASC']],
});

showtimes.forEach(s =>
  console.log(`${s.film.title} — ${s.showDate} ${s.showTime}`)
);
```

---

## 4. Creating related rows

Because the association exists, Sequelize gives you helper methods named after the
alias (`createShowtime`, `getShowtimes`, `setFilm`, …).

```js
// Create a film, then a showtime attached to it
const film = await Films.create({ title: 'Dune', genre: 'Sci-Fi', duration: 155 });

// Option A: use the generated helper (filmId is filled in automatically)
await film.createShowtime({ showDate: '2026-06-10', showTime: '19:30', price: 12.5 });

// Option B: set the foreign key yourself
await Showtimes.create({
  filmId: film.id,
  showDate: '2026-06-10',
  showTime: '21:45',
  price: 12.5,
});
```

---

## 5. Quick reference

| Side          | Method        | Lives on        | Alias style | FK column          |
|---------------|---------------|-----------------|-------------|--------------------|
| "one"         | `hasMany`     | parent model    | plural      | on the child table |
| "many"        | `belongsTo`   | child model     | singular    | on the child table |

Rules of thumb:

- The **foreign key always sits on the `belongsTo` side** (the "many" table).
- Define **both** halves so includes work in either direction.
- The `as` alias you pick is exactly the key you read on the result and pass to
  `include`.
- `include` = JOIN. No raw SQL needed.

You can apply the exact same pattern to the other relationships in the assignment,
e.g. `Users.hasMany(Bookings)` / `Bookings.belongsTo(Users)`, and
`Showtimes.hasMany(Bookings)` / `Bookings.belongsTo(Showtimes)`.

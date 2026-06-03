# Sequelize Aggregates — `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`

How to compute totals and counts in Sequelize. Two levels:

1. **Shortcut methods** — `count()`, `sum()`, `max()`, `min()` for quick single numbers.
2. **`fn` + `col` + `group`** — the flexible way, for "per group" results and several
   aggregates in one query.

Assumes the models/associations from the other ex3 demos
(`Films`, `Showtimes`, `Bookings`, `Users`).

---

## 1. Shortcut methods (one number back)

Every model has `count`, `sum`, `min`, `max` built in.

```js
import { Bookings } from '../models/index.js';

// How many bookings exist?
const total = await Bookings.count();

// How many confirmed bookings?
const confirmed = await Bookings.count({ where: { status: 'confirmed' } });

// Total revenue across all bookings
const revenue = await Bookings.sum('totalPrice');

// Most expensive single booking
const max = await Bookings.max('totalPrice');
```

`sum`/`max`/`min` take the **column name** as the first argument and return a plain
number (or `null` if there are no rows).

---

## 2. `fn`, `col` and `literal`

For anything beyond one number — aliasing results, several aggregates at once, or
grouping — you build the expression with helpers imported from `sequelize`:

- **`fn('SUM', col('totalPrice'))`** → `SUM(totalPrice)`
- **`col('films.title')`** → a raw column reference
- **`literal('...')`** → raw SQL when nothing else fits

```js
import { fn, col, literal } from 'sequelize';
import { Bookings } from '../models/index.js';

const stats = await Bookings.findAll({
  attributes: [
    [fn('COUNT', col('id')), 'bookingCount'],
    [fn('SUM', col('totalPrice')), 'revenue'],
    [fn('AVG', col('totalPrice')), 'avgPrice'],
  ],
  raw: true, // return plain objects, not model instances
});

console.log(stats[0]); // { bookingCount: 42, revenue: '520.00', avgPrice: '12.38' }
```

Each entry is a `[expression, alias]` pair. `raw: true` makes the result easy to read.

> Note: `SUM`/`AVG` over a `DECIMAL` column come back as **strings** in MySQL.
> Wrap with `Number(...)` if you need a JS number.

---

## 3. Aggregates per group (`group`)

Add `group` to get one row per category — this is the `GROUP BY`.

### Bookings count + revenue per showtime

```js
import { fn, col } from 'sequelize';
import { Bookings } from '../models/index.js';

const perShowtime = await Bookings.findAll({
  attributes: [
    'showtimeId',
    [fn('COUNT', col('id')), 'bookingCount'],
    [fn('SUM', col('totalPrice')), 'revenue'],
  ],
  group: ['showtimeId'],
  raw: true,
});
// [ { showtimeId: 10, bookingCount: 3, revenue: '37.50' }, ... ]
```

### Average rating per film (from a comments/reviews model)

```js
const ratings = await Comments.findAll({
  attributes: [
    'filmId',
    [fn('AVG', col('rating')), 'avgRating'],
    [fn('COUNT', col('id')), 'reviewCount'],
  ],
  where: { status: 'approved' },
  group: ['filmId'],
  raw: true,
});
```

---

## 4. Aggregates across a JOIN (`group` + `include`)

Combine with `include` to group by a column on the joined table — e.g. revenue and
booking count **per film**, going through `showtimes`.

```js
import { fn, col } from 'sequelize';
import { Films, Showtimes, Bookings } from '../models/index.js';

const popular = await Films.findAll({
  attributes: [
    'id',
    'title',
    [fn('COUNT', col('showtimes.bookings.id')), 'bookingCount'],
    [fn('SUM', col('showtimes.bookings.totalPrice')), 'revenue'],
  ],
  include: {
    model: Showtimes,
    as: 'showtimes',
    attributes: [], // don't select showtime columns, only aggregate through them
    include: {
      model: Bookings,
      as: 'bookings',
      attributes: [],
    },
  },
  group: ['films.id'],
  order: [[literal('bookingCount'), 'DESC']],
  raw: true,
});
```

Key points:

- Reference joined columns by **alias path**: `col('showtimes.bookings.totalPrice')`.
- Put `attributes: []` on the included models so only your aggregates come back.
- `group: ['films.id']` collapses to one row per film.

---

## 5. Filtering on the aggregate (`HAVING`)

`WHERE` filters rows *before* grouping; `having` filters *after* (e.g. "only films with
more than 5 bookings").

```js
import { fn, col, literal } from 'sequelize';

const topFilms = await Films.findAll({
  attributes: [
    'id',
    'title',
    [fn('COUNT', col('showtimes.bookings.id')), 'bookingCount'],
  ],
  include: {
    model: Showtimes, as: 'showtimes', attributes: [],
    include: { model: Bookings, as: 'bookings', attributes: [] },
  },
  group: ['films.id'],
  having: literal('bookingCount >= 5'),
  raw: true,
});
```

---

## 6. Quick reference

| Goal                              | How                                                        |
|-----------------------------------|------------------------------------------------------------|
| Count all / filtered rows         | `Model.count({ where })`                                   |
| Sum / min / max one column        | `Model.sum('col')`, `Model.max('col')`, `Model.min('col')` |
| Build an aggregate expression     | `fn('SUM', col('totalPrice'))`                             |
| Alias the result                  | `[fn(...), 'aliasName']` in `attributes`                   |
| One row per category              | `group: ['someColumn']`                                    |
| Aggregate through a JOIN          | `include` with `attributes: []` + `col('alias.path.col')`  |
| Filter after grouping             | `having: literal('alias >= n')`                            |
| Get plain objects, not instances  | `raw: true`                                                |

Rules of thumb:

- Quick single number → use the shortcut methods (`count`, `sum`, …).
- Per-group or multiple aggregates → `attributes` with `fn`/`col` + `group`.
- `DECIMAL` sums come back as strings — `Number(...)` them if needed.

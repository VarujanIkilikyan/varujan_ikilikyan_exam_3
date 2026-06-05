import HttpErrors from 'http-errors';
import {FilmsModel,ShowtimeModel} from '../models/Index.model.js';
import {Op}  from 'sequelize'

export default {
    async search (req, res, next) {
        try {
            const {search,page} = req.query;

            const limitNum = 10;
            const pageNum = Math.max(1, parseInt(page) || 1);
            const offset = Math.ceil((pageNum - 1) * limitNum);

            const whereCondition = {};

            if (search && search.trim() !== '') {
                whereCondition.title = {
                    [Op.like]: `%${search}%`
                };
            }

            const {count,rows} = await FilmsModel.findAndCountAll({
                where: whereCondition,
                limit: limitNum,
                offset:offset,
                order: [['title', 'ASC']]
            });

            res.json({
                message: 'get all users',
                FilmList:rows,
                pagination: {
                    "currentPage": pageNum,
                    "totalPages": Math.ceil(count / limitNum),
                    "totalUsers": count,
                    "UsersPerPage": limitNum,
                }
            })
        }catch (e){
            next(e);
        }
},
    async Showtime (req, res, next) {
        try {
            const id = req.params.id;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const whereCondition = {};
            if (id) {
                whereCondition.id = id;
            }

            const {count,rows} = await FilmsModel.findAndCountAll( {
                where: whereCondition,
                include: [
                    {
                        model:ShowtimeModel,
                        as: 'showtimes',
                        where: {
                            showdate: {[Op.gte]: new Date(), }

                        },
                        attributes: ['id', 'showdate', 'showtime', 'price', 'availableseats'],
                    }
                ],
                distinct:true,
                limit: limit,
                offset: offset,
                order: [
                    [{ model: ShowtimeModel, as: 'showtimes' }, 'showdate', 'ASC'],
                    [{ model: ShowtimeModel, as: 'showtimes' }, 'showtime', 'ASC']
                ]
            });

            if (!rows) {
                throw new Error('Фильм не найден');
            }

            res.json({
                message: 'get all users',
                FilmList:rows,
                pagination: {
                    totalItems: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    limit: limit
                },

            })


        }catch (e){
            next(e);
        }
    },
    async  Showtimebyid(req, res, next) {
        try {
            const id = req.params.id;

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const film = await FilmsModel.findByPk(id);

            if (!film) {
                return res.status(404).json({ message: 'Фильм не найден' });
            }

            const showtimeWhereCondition = {
                filmid: id,
                showdate: { [Op.gte]: new Date() },
                availableseats: { [Op.gt]: 0 }
            };

            const totalShowtimes = await ShowtimeModel.count({
                where: showtimeWhereCondition
            });


            const showtimes = await ShowtimeModel.findAll({
                where: showtimeWhereCondition,
                attributes: ['id', 'showdate', 'showtime', 'price', 'availableseats', 'totalseats'],
                limit: limit,
                offset: offset,
                order: [
                    ['showdate', 'ASC'],
                    ['showtime', 'ASC']
                ]
            });


            return res.json({
                message: 'Расписание фильма успешно получено',
                film: film,
                showtimes: showtimes,
                pagination: {
                    totalItems: totalShowtimes,
                    totalPages: Math.ceil(totalShowtimes / limit),
                    currentPage: page,
                    limit: limit
                },

            });

        } catch (e) {
            next(e);
        }
    }


}
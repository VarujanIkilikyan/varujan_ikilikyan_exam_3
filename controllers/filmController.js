import HttpErrors from 'http-errors';
import {FilmsModel} from '../models/Index.model.js';
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
}
}
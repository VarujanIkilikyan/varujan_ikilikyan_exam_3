import HttpErrors from 'http-errors';
import {FilmsModel,ShowtimeModel} from '../models/Index.model.js';
import {Op}  from 'sequelize'
import moment from 'moment';


export default {

    async addFilm(req, res, next) {
        try {
            const {title, description, genre, duration} = req.body;



            const Film = await FilmsModel.create(
                {title, description, genre, duration})


            res.json({
                message: 'film created successfully',
                Film
            })
        } catch (e) {
            next(e);
        }
    },
    async updateFilm(req, res, next) {
        try {
            const {title, description, genre, duration} = req.body;
            const id =req.params.id;

           const movie = await  FilmsModel.findByPk(id);
           if(!movie){
               throw new HttpErrors(400, {
                   message: 'movie not found',
               })
           }
           const oldFilmData = movie.toJSON()

            const updateData = {};
            if (title !== undefined && title !== null) updateData.title = title;
            if (description !== undefined && description !== null) updateData.description = description;
            if (genre !== undefined && genre !== null) updateData.genre = genre;
            if (duration !== undefined && duration !== null) updateData.duration = duration;

            await movie.update(updateData)
            await movie.reload();
            const newFilmData = movie.toJSON()


            res.json({
                message: 'film Update successfully',
                oldFilmData,
                newFilmData
            })
        } catch (e) {
            next(e);
        }
    },

     async deleteFilm(req, res, next) {
        try {
            const id = req.params.id;
            const movie = await FilmsModel.findByPk(id);
            if(!movie){
                throw new HttpErrors(400, {
                    message: 'movie not found',
                })
            }
            const deletedMovie = movie.toJSON()
            await movie.destroy()

            res.json({
                message: 'deleted movie',
                Film: deletedMovie,
            })

        }catch (e) {
            next(e);
        }
    },
    async addShowTime(req, res, next) {
        try {
            const  id = req.params.id;
            const {showdate, showtime, price, totalseats } = req.body;

            const film = await FilmsModel.findByPk(id);
            if (!film) {
                return res.status(404).json({ message: 'Фильм не найден' });
            }
            const startOfDay = moment(showdate).startOf('day').toDate();
            const endOfDay = moment(showdate).endOf('day').toDate();

            const showtimesCount = await ShowtimeModel.count({
                where: {
                    filmid: film.id,
                    showdate: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                }
            });

            if (showtimesCount >= 3) {
                return res.status(400).json({
                    message: 'Превышен лимит: для одного фильма нельзя добавить более 3 сеансов в день'
                });
            }


            const newShowtime = await ShowtimeModel.create({
                filmid: film.id,
                showdate,
                showtime,
                price,
                totalseats,
                availableseats: totalseats
            });

            res.status(201).json(newShowtime);
        } catch (err) {
            next(err);
        }
    }

}
import {UsersModel,FilmsModel,ShowtimeModel} from './models/Index.model.js';


    (async () => {
    console.log('Running migration...');
    const modelsList = [UsersModel,FilmsModel,ShowtimeModel];
        for (let model of modelsList){
           await model.sync({alter: true});
            console.log(`model->${ model.name}->synchronized`)
        }
    console.log('Migration finished successfully.');
})();


import {UsersModel} from './models/Index.model.js';


    (async () => {
    console.log('Running migration...');
    const modelsList = [UsersModel];
        for (let model of modelsList){
           await model.sync({alter: true});
            console.log(`model->${ model.name}->synchronized`)
        }
    console.log('Migration finished successfully.');
})();


const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect('mongodb+srv://rohan566566:RikU0AYjO0B06pxw@cluster0.3uvu82b.mongodb.net/ngoDb?retryWrites=true&w=majority' , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const fetchedData = await mongoose.connection.db.collection('videoData').find({}).toArray();
        global.videoData = fetchedData
        console.log('mongo connected');
    } catch (error) {
        throw error
    }
}

module.exports = connectToDb
const express = require('express');
const { Transform, Readable } = require('stream');
const app = express();

class DelayStream extends Transform {
    constructor(delay) {
        super();
        this.delay = delay;
    }

    _transform(chunk, encoding, callback) {
        const chunkArray = chunk.toString().split('');
        const pushChunk = (index) => {
            if (index < chunkArray.length) {
                this.push(chunkArray[index]);
                setTimeout(() => pushChunk(index + 1), this.delay);
            } else {
                callback();
            }
        };
        pushChunk(0);
    }
}

app.get('/', (req, res, next) => {
    const data = 'Hello World from a Stream!';
    console.log('Request received');
    const stream = new Readable({
        read() {
            this.push(data);
            this.push(null);
        }
    });
    const delayStream = new DelayStream(1000);
    stream.pipe(delayStream).pipe(res);
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
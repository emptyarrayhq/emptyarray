import { Worker } from "bullmq";
import { arrayQueue } from "../loaders/bullmq.loader.js";
import { redisConnection } from "../loaders/redis.loader.js";
import { createArray } from "../services/lib/array.service.js";

const processArrayJob = async (job) => {
    const { user } = job.data;

    const arrayData = { name: "Home", icon: "home", identifier: "home" };

    try {
        await createArray(user, arrayData);

        console.log("Job completed successfully for user:", user);
    } catch (error) {
        console.error('Error processing Spaces, Blocks, and Labels:', error);
        throw error;
    }
};

const arrayWorker = new Worker('arrayQueue', async (job) => {
    await processArrayJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

// Worker Event Listeners
arrayWorker.on('completed', async (job) => {
    console.log(`Job with ID ${job.id} has been completed`);
    await job.remove();
});

arrayWorker.on('failed', (job, err) => {
    console.error(`Job with ID ${job.id} has failed with error: ${err.message}`);
    if (job.attemptsMade < job.opts.attempts) {
        console.log(`Retrying job ${job.id} (${job.attemptsMade}/${job.opts.attempts})`);
    } else {
        console.log(`Job ${job.id} failed permanently after ${job.opts.attempts} attempts`);
    }
});

arrayWorker.on('error', (err) => {
    console.error('Redis connection error in worker:', err);
});

export {
    arrayWorker,
    arrayQueue
};

import { pipeline } from '@xenova/transformers';
import { MessageTypes } from './presets';

class MyTranscriptionPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'openai/whisper-tiny.en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const { type, audio } = event.data;
    if (type === MessageTypes.INFERENCE_REQUEST) {
        await transcribe(audio);
    }
});

async function transcribe(audio) {
    sendLoadingMessage('loading');

    let transcriber;
    try {
        transcriber = await MyTranscriptionPipeline.getInstance(load_model_callback);
    } catch (err) {
        console.error("Error loading model:", err.message);
        return;
    }

    sendLoadingMessage('success');

    try {
        const result = await transcriber(audio, {
            top_k: 0,
            do_sample: false,
            chunk_length: 30,
            stride_length_s: 5,
            return_timestamps: true
        });

        createResultMessage(result, true, result?.chunks?.[result.chunks.length - 1]?.end || 0);
    } catch (err) {
        console.error("Transcription error:", err.message);
    }
}

async function load_model_callback(data) {
    const { status, file, progress, loaded, total } = data;
    if (status === 'progress') {
        sendDownloadingMessage(file, progress, loaded, total);
    }
}

function sendLoadingMessage(status) {
    self.postMessage({
        type: MessageTypes.LOADING,
        status
    });
}

function sendDownloadingMessage(file, progress, loaded, total) {
    self.postMessage({
        type: MessageTypes.DOWNLOADING,
        file,
        progress,
        loaded,
        total
    });
}

function createResultMessage(results, isDone, completedUntilTimestamp) {
    self.postMessage({
        type: MessageTypes.RESULT,
        results,
        isDone,
        completedUntilTimestamp
    });
}

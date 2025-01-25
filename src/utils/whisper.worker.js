import {pipeline} from '@xenova/transformers';

class MyTranscriptionPipeline{
    static task = 'automatic-speech-recognition';
    static model = 'openai/whisper-tiny.en';
    static instance = null;

    static async getInstance(progress_callback = null){
        if(this.instance === null){
            this.instance = await pipeline(this.task,null,null,{
                progress_callback
            });
        }
        return this.instance;
    }
}

self.addEventListener('message',async (e) => {
    const {type,audio} = e.data
    if(type===MessageTypes.INFERENCE_REQUEST){
        await transcribe(audio);
    }});

    async function transcribe(audio){
        sendLoadingMessage('Loading');
        let pipeline

        try{
            pipeline = await MyTranscriptionPipeline.getInstance(load_modal_callback);
        }
        catch(err){
            console.log(err.message);
        }

        sendLoadingMessage('Success');

        const stride_length_s=5;

        const generationTracker= new GenerationTracker(pipeline,stride_length_s);
        await pipeline(audio,{
            top_k:0,
            do_sample:false,
            chunk_lenght:30,
            stride_length_s,
            return_timestamps:true,
            callback_function:generationTracker.callbackFunction.bind(generationTracker),
        });
        generationTracker.finish();

        }
        async function load_modal_callback(data){
            const {status} = data
            if(status === 'progress'){
                const {file,progress,loaded,total} = data;
                sendDownloadMessage(progress,loaded,total,file);

        }
    }
    async function sendLoadingMessage(status){
        self.postMessage({
            type:MessageTypes.LOADING,
            status,
        });
    }

    async function sendDownloadMessage(progress,loaded,total,file){
        self.postMessage({
            type:MessageTypes.DOWNLOADING,
            progress,
            loaded,
            total,
            file,
        });
    }
    
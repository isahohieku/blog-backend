
interface APIResponseI {
    code: string;
    statusCode: number;
    message: string;
    data?: any[] | {} | undefined | null;
}

class APIResponse implements APIResponseI {
    public code;
    public statusCode;
    public message;
    public data;

    public constructor(
        code: string,
        statusCode: number,
        message: string,
        data = undefined
    ) {
        this.code = code;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

export default APIResponse;
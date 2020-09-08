
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
    public pagination;

    public constructor(
        code: string,
        statusCode: number,
        message: string,
        data = undefined,
        pagination = undefined
    ) {
        this.code = code;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
    }
}

export default APIResponse;
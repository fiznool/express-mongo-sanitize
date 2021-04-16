import {Request, Response, Handler} from "express"

declare namespace ExpressMongoSanitize {
    interface Options {
        replaceWith?: string;
        onSanitize?: (req: Request, res: Response) => unknown;
        dryRun?: boolean;
    }
}


type Middleware = {
    /**
     * Create middleware instance
     * @param options
     */
    (options?: ExpressMongoSanitize.Options): Handler;
    /**
     * Remove any keys containing prohibited characters
     * @param target
     * @param options
     */
    sanitize<T extends object>(target: T, options?: ExpressMongoSanitize.Options): T;
    /**
     * Check if the payload has keys with prohibited characters‘
     * @param target
     */
    has(target: object): boolean;
};

declare const ExpressMongoSanitize: Middleware & {
    default: typeof ExpressMongoSanitize;
};

export = ExpressMongoSanitize;

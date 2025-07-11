
declare namespace Express{
    interface Request {
        user?: admin.auth.DecodedIdToken;
    }
}
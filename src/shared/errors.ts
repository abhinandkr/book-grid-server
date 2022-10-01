import HttpStatusCodes from 'http-status-codes';

export abstract class CustomError extends Error {
	public readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

	protected constructor(msg: string, httpStatus: number) {
		super(msg);
		this.HttpStatus = httpStatus;
	}
}

export class ParamMissingError extends CustomError {
	public static readonly Msg =
		'One or more of the required parameters was missing.';
	public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

	constructor() {
		super(ParamMissingError.Msg, ParamMissingError.HttpStatus);
	}
}

export class AuthorNotFoundError extends CustomError {
	public static readonly Msg =
		'An author with the given name does not exist in the database.';
	public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;

	constructor() {
		super(AuthorNotFoundError.Msg, AuthorNotFoundError.HttpStatus);
	}
}

export class ApiError extends CustomError {
	public static readonly Msg =
		'DBPedia API returned incomplete result. Check with API owner';
	public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;

	constructor() {
		super(ApiError.Msg, ApiError.HttpStatus);
	}
}
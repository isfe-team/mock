enum IResponeResultStatus {
  OK = 1,
  ERROR = 0
}

export default interface IResponseResult<T> {
  status: IResponeResultStatus;
  message: string;
  data: T;
}

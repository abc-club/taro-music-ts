declare namespace API {
  export interface Response {
    data: any,
    errMsg: string,
    statusCode: number,
    header: any,
    cookies: Array<{
      name: string,
      value: string,
      expires: string,
      path: string
    }>,
  }
}

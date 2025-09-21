class apiError extends Error {
  constructor(
    statusCode,
    message= " Something went wrong",
    stack="",
    errors=[]
  ){
    super(message)
    this.errors=errors
    this.data=null
    this.success=false
    this.statusCode=statusCode

    if(stack){
        this.stack=stack
    }else{
        Error.captureStackTrace(this, this.constructor)
    }
  }
}
export {apiError}
/**
 * 全局代码错误捕捉
 * 比如 null.length 就会被捕捉到
 */

export default (error, vm)=>{
	console.log(error)
	// 过滤HTTP请求错误
	if (error === undefined || error === null || typeof error.code !== 'undefined' || error.code === 0) {
		return false;
	}

	let errorMap = {
		InternalError: "Javascript引擎内部错误",
		ReferenceError: "未找到对象",
		TypeError: "使用了错误的类型或对象",
		RangeError: "使用内置对象时，参数超范围",
		SyntaxError: "语法错误",
		EvalError: "错误的使用了Eval",
		URIError: "URI错误"
	}
	let errorName = errorMap[error.message] || "未知错误"

	console.warn(`[YQCode error]: ${error}`);
	console.error(error);
	//throw error;

	vm.$nextTick(() => {
		vm.$notify.error({
			title: errorName,
			message: error
		});
	})
}

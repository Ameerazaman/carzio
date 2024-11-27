import { toast } from 'react-hot-toast';
var errorHandler = function (error) {
    var _a;
    var axiosError = error;
    if ((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data) {
        var errorResponse = axiosError.response.data;
        toast.error(errorResponse.message);
    }
    else {
        toast.error('Something went wrong. Please try again!');
    }
};
export default errorHandler;

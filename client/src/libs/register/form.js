export const formRegisterLib = {
    title:"Đăng Ký",
    accountIf:"Nếu bạn đã có tài khoản, vui lòng",
    btnLogin:"Đăng nhập",
    formItems:[
        {   
            idDiff:"input",
            type:"number",
            uniqueInput:"number_phone",
            name:"Số điện thoại(dùng để đăng nhập)",
            message:"Xin vui lòng không để trống, tối thiểu 6 ký tự và nhập đúng định dạng"
        },
        {   
            idDiff:"input",
            type:"email",
            uniqueInput:"email",
            name:"Email",
            message:"Xin vui lòng không để trống, tối thiểu 6 ký tự và nhập đúng định dạng"
        },
        {   
            idDiff:"input",
            type:"password",
            uniqueInput:"password",
            name:"Mật khẩu",
            message:"Xin vui lòng không để trống và tối thiểu 6 ký tự"
        },
        {   
            idDiff:"input",
            type:"password",
            uniqueInput:"confirm",
            confirmPass: true,
            name:"Xác nhận mật khẩu",
            message:"Xin vui lòng không để trống và tối thiểu 6 ký tự"
        },
        {   
            idDiff:"input",
            type:"text",
            uniqueInput: "full_name",
            name:"Họ tên",
            message:"Xin vui lòng không để trống và tối thiểu 6 ký tự"
        },
        {   
            idDiff:"date",
            type:"date",
            uniqueInput: "birthday",
            name:"Ngày sinh",
            message:"Xin vui lòng không để trống và chọn mốc thời gian"
        },
        {   
            idDiff:"select",
            name:"Hình thức kinh doanh",
            uniqueInput: "business_type",
            default:"Lựa chọn hình thức",
            message:"Xin vui lòng chọn hình thức kinh doanh",
            valueSelect:"business"
        },
        {   
            idDiff:"select",
            name:"Tỉnh/TP",
            uniqueInput: "city_id",
            default:"Chọn Tỉnh/TP",
            message:"Xin vui lòng chọn Tỉnh/TP",
            valueSelect:"city"
        },
        {   
            idDiff:"textarea",
            type:"text",
            uniqueInput:"address",
            name:"Địa chỉ",
            message:"Xin vui lòng không để trống và tối thiểu 6 ký tự"
        },
        {   
            idDiff:"input",
            type:"text",
            uniqueInput:"business_name",
            name:"Tên cơ sở kinh doanh",
            message:"Xin vui lòng không để trống và tối thiểu 6 ký tự"
        },
        {   
            idDiff:"input",
            type:"text",
            uniqueInput:"user_referer",
            name:"Người giới thiệu",
            message:null,
            reqField: "not",
        },
    ]
}
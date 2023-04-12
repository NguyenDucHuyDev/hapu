const company = {
    companyName:"CÔNG TY CỔ PHẦN THƯƠNG MẠI DƯỢC VƯƠNG",
    phone:"0878.929.789",
    email:"giathuochapu@gmail.com",
    companyAddress:[
        {
            content:"Trụ sở: Số 62 ngõ 6 đường Vũ Trọng Phụng, phường Thanh Xuân Trung, quận Thanh Xuân, Hà Nội."
        },
        {
            content:"Showroom: Quầy 435, Chợ thuốc Hapulico, số 85 Vũ Trọng Phụng, Thanh Xuân, Hà Nội"
        },
        {
            content: `Phone: 0878.929.789`
        },
        {
            content: "Email: giathuochapu@gmail.com"
        },
        {
            content: "Tên người đại diện: Ông Vũ Mạnh Thắng"
        },
        {
            content: "Số giấy chứng nhận đăng ký kinh doanh: 0105 950 400 – Ngày cấp: 23/07/2012 – Nơi cấp: Sở KH&ĐT TP. Hà Nội"
        },
        {
            content:"Số giấy chứng nhận đủ điều kiện kinh doanh thuốc: Số 01-0780/ĐKKĐ-HNO/ĐC – Ngày cấp: 05/07/2021 – Nơi cấp: Sở y tế Hà Nội"
        }
    ]
}

const info = {
    nameInfo:"THÔNG TIN CHUNG",
    infoItems:[
        {
            content:"Giới thiệu",
            link: "/lich-su-hinh-thanh-va-phat-trien",
        },
        {
            content:"Chính sách bảo mật",
            link: "/chinh-sach-bao-mat",
        },
        {
            content:"Điều khoản sử dụng",
            link: "/dieu-khoan-su-dung",
        },
        {
            content:"Hướng dẫn đặt hàng, thanh toán",
            link: "/huong-dan-dat-hang-nhanh",
        },
        {
            content:"Quy định đổi trả hàng, hoàn tiền",
            link: "/quy-dinh-doi-tra-hang-hoan-tien",
        },
        {
            content:"Chính sách giải quyết khiếu nại",
            link: "/chinh-sach-giai-quyet-khieu-nai",
        },
        {
            content:"Câu hỏi thường gặp",
            link: "/cau-hoi-thuong-gap",
        },
        {
            content:"Chính sách vận chuyển",
            link: "/chinh-sach-van-chuyen",
        },
    ]
}

const contact = {
    contactTitle:"LIÊN HỆ",
}

const license = {
    license:"Bản quyền thuộc về Công ty CPTM Dược Vương - 2023. Phát triển bởi",
    titanWeb:"TitanWeb"
}

const footerLib = {
        ...company,
        ...info,
        ...contact,
        ...license
}

export default footerLib 
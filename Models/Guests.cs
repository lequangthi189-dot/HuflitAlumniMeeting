using System.ComponentModel.DataAnnotations;

namespace HuflitAlumniMeeting.Models
{
    public class Guests
    {
            [Required(ErrorMessage = "Vui lòng nhập họ tên của bạn.")]
            public string? Name { get; set; }

            [Required(ErrorMessage = "Vui lòng nhập địa chỉ email.")]
            [EmailAddress(ErrorMessage = "Email không đúng định dạng (ví dụ: abc@gmail.com).")]
            public string? Email { get; set; }

            [Required(ErrorMessage = "Vui lòng nhập số điện thoại.")]
            [RegularExpression(@"^(0[3|5|7|8|9])+([0-9]{8})$", ErrorMessage = "Số điện thoại Việt Nam không hợp lệ.")]
            public string? Phone { get; set; }

            // Bắt buộc chọn khóa học. Dùng int? (nullable) để giá trị mặc định là null thay vì 0
            [Required(ErrorMessage = "Vui lòng chọn khóa học của bạn.")]
            public int? courses { get; set; }

            // Bắt buộc chọn có tham dự hay không. Dùng bool? (nullable) để kiểm tra người dùng đã chọn chưa
            [Required(ErrorMessage = "Vui lòng xác nhận bạn có tham dự hay không.")]
            public bool? WillAttend { get; set; }
        
    }
}

import { onlyAdmin } from "#src/middleware/authentication.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * 
 * @param {import("#root/types.js").Request} req 
 * @param {import("#root/types.js").Response} res 
 */
const view = async (req, res) => {
	const client = req.S3Client;
	const { upload, file } = req.only([
		"upload",
		"file"
	]);
	const targetFile = file || upload;
	const file_name = `${targetFile.md5}.${targetFile.name.split(".").at(-1)}`;
	const params = {
		"Body": targetFile.data,
		"Bucket": process.env.AWS_BUCKET_IMAGE,
		"Key": file_name,
	};
	const command = new PutObjectCommand(params);
	client.send(command)
		.then(() => {
			const url = new URL(process.env.AWS_OBJECT_URL);
			url.pathname = file_name;
			if(req.headers["upload-from"] === "CKEDITOR") {
				return res.send({
					url: url.href
				});
			}
			res.responseSuccess({
				url: url.href
			});
		})
		.catch((err) => {
			console.error(err);
			throw new Error(JSON.stringify({ message: "Có lỗi khi upload ảnh!", http_code: 500}));
		});
};

export default {
	view,
	middleware: [
		onlyAdmin
	]
};



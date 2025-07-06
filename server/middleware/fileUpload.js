import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ApiError from "#utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "storage", "uploads");
const hotDir = path.join(__dirname, "..", "storage", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (!fs.existsSync(hotDir)) {
  fs.mkdirSync(hotDir);
}

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  },
});

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, hotDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  },
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, "Only image files are allowed"), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, "Only document files are allowed"), false);
  }
};

const attachmentFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, "Only image or document files are allowed"), false);
  }
};

// General-purpose factory for upload middleware which converts multer errors to ApiError and checks for file presence
function createUploadMiddleware({
  fileFilter,
  limits = { fileSize: 5 * 1024 * 1024 },
  fieldName = "file",
  storage,
  multiple = false,
} = {}) {
  const upload = multiple
    ? multer({ storage, fileFilter, limits }).array(fieldName)
    : multer({ storage, fileFilter, limits }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case "LIMIT_FILE_SIZE":
              return next(new ApiError(400, "File size exceeds limit"));
            case "LIMIT_UNEXPECTED_FILE":
              return next(new ApiError(400, "Unexpected file field"));
            case "LIMIT_FILE_COUNT":
              return next(new ApiError(400, "Too many files uploaded"));
            default:
              return next(new ApiError(400, "File upload error"));
          }
        }
        return next(err); // Other errors
      }

      if ((!multiple && !req.file) || (multiple && !req.files.length)) {
        return next(new ApiError(400, "No file uploaded"));
      }

      next();
    });
  };
}

export const imageUpload = createUploadMiddleware({
  fileFilter: imageFilter,
  fieldName: "image",
  storage: uploadStorage,
});

export const attachmentUpload = createUploadMiddleware({
  fileFilter: attachmentFilter,
  fieldName: "attachment",
  storage: uploadStorage,
});

export const documentUpload = createUploadMiddleware({
  fileFilter: documentFilter,
  fieldName: "documents",
  storage: documentStorage,
  multiple: true,
});

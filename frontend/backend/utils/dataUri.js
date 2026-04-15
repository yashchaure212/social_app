import path from "path";
import DataURIParser from "datauri/parser.js";

const parser = new DataURIParser();

const getDataURI = (file) => {
    try {
        if (!file) return null;

        // allow only image files
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error("Invalid file type");
        }

        const extName = path.extname(file.originalname).toString();

        return parser.format(extName, file.buffer).content;

    } catch (error) {
        console.error("DataURI Error:", error);
        throw error;
    }
};


export default getDataURI;
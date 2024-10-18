// import { itemQueue } from "../../loaders/bullmq.loader.js";
import { createItem, filterItems, updateItem, getItem, getItemFilterByLabel, searchItemsByTitle, getAllItemsByBloack, createInboxItem } from "../../services/lib/item.service.js";
import { linkPreviewGenerator } from "../../services/lib/linkPreview.service.js";

const extractUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    return urls ? urls[0] : null;
};

const generateLinkPreview = async (requestedData) => {
    const url = requestedData.metadata?.url || extractUrl(requestedData.title);

    if (!url) return null;

    const { title: previewTitle, favicon } = await linkPreviewGenerator(url);

    return {
        ...requestedData,
        title: previewTitle || requestedData.title,
        type: 'link',
        metadata: {
            ...requestedData.metadata,
            url,
            favicon
        }
    };
};

const createItemController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space, block } = req.params;
        const requestedData = req.body;
        const { type } = requestedData;

        let itemData = requestedData;

        if (type === 'link' || type === 'text') {
            const updatedData = await generateLinkPreview(requestedData);
            if (updatedData) {
                itemData = updatedData;
            }
        }

        const item = await createItem(user, itemData, space, block);

        return res.status(200).json({ item });
    } catch (err) {
        next(err);
    }
};

const createInboxItemController = async (req, res, next) => {
    try {
        const user = req.user._id;

        const requestedData = req.body;
        const items = await createInboxItem(user, requestedData);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const updateItemController = async (req, res, next) => {
    try {
        const { space, block, item: id } = req.params;
        const updateData = req.body;
        const item = await updateItem(id, updateData, space, block);

        res.status(200).json({
            item
        });
    } catch (err) {
        next(err);
    }
};

const filterItemsController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const filters = {
            dueDate: req.query.dueDate
        };
        const sortOptions = req.query.sort;

        const items = await filterItems(user, filters, sortOptions);

        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

const getAllItemsByBloackController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space, block } = req.params;
        const items = await getAllItemsByBloack(user, space, block);

        res.status(200).json({
            items
        });
    } catch (err) {
        next(err);
    }
};

const getItemController = async (req, res, next) => {
    try {
        const user = req.user._id;
        const { space, block, item: id } = req.params;

        const item = await getItem(user, id, space, block);

        res.status(200).json({
            item
        });
    } catch (err) {
        next(err);
    }
};

const getItemFilterByLabelController = async (req, res, next) => {
    const { name } = req.query;
    const { space } = req.params;
    const user = req.user._id;

    try {
        const items = await getItemFilterByLabel(name, user, space);
        res.status(200).json(items);
    } catch (err) {
        next(err);
    }
};

const searchItemsByTitleController = async (req, res, next) => {
    const { q } = req.query;
    const user = req.user._id;
    try {
        const items = await searchItemsByTitle(q, user);
        res.status(200).json({
            response: items
        });
    } catch (err) {
        next(err);
    }
};

export {
    createItemController,
    filterItemsController,
    updateItemController,
    getItemController,
    getItemFilterByLabelController,
    searchItemsByTitleController,
    getAllItemsByBloackController,
    createInboxItemController
}

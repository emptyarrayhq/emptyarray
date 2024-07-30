import { createBlock, getBlocks, deleteBlock } from "../../services/lib/block.service.js";

const createBlockController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const requestedData = req.body;
        const block = await createBlock(user, requestedData);

        res.status(200).json({
            status: 200,
            response: block
        });
    } catch (err) {
        next(err);
    }
};

const getBlocksController = async (req, res, next) => {
    try {
        const user = req.auth.userId;

        const blocks = await getBlocks(user);

        res.status(200).json({
            status: 200,
            response: blocks
        });
    } catch (err) {
        next(err);
    }
};

const deleteBlockController = async (req, res, next) => {
    try {
        const { id } = req.body;
        const block = await deleteBlock(id);

        res.status(200).json({
            status: 200,
            message: 'block deleted successfully',
            block
        });
    } catch (err) {
        next(err);
    }
};

export {
    createBlockController,
    getBlocksController,
    deleteBlockController
}

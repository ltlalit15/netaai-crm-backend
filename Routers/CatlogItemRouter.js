import express from 'express';
import CatalogController from '../Controllers/CatlogItemCtrl.js';

const router = express.Router();

router.post('/catalog', CatalogController.createItem);
router.get('/catalog', CatalogController.getAllItems);
router.get('/catalog/:id', CatalogController.getItemById);
router.put('/catalog/:id', CatalogController.updateItem);
router.delete('/catalog/:id', CatalogController.deleteItem);

export default router;

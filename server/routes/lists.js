const express = require('express');
const List = require('../models/List');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { name, columns } = req.body;
  try {
    const newList = new List({ name, columns: [], rows: [] });
    await newList.save();
    res.status(201).send(newList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const lists = await List.find();
    res.send(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/rows', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    res.send(list.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/rows', auth, async (req, res) => {
  const { row } = req.body;
  try {
    const list = await List.findById(req.params.id);
    list.rows.push({ data: row });
    await list.save();
    res.status(201).send(list.rows[list.rows.length - 1]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id/rows/:rowId', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    list.rows.id(req.params.rowId).remove();
    await list.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id/columns/:columnName', auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    list.columns = list.columns.filter(column => column.name !== req.params.columnName);
    list.rows = list.rows.map(row => {
      delete row.data[req.params.columnName];
      return row;
    });
    await list.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

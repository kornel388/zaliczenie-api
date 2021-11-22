const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const checkAuth = require("../middleware/check-auth");
const Books = require("../models/books");

router.get("/all", checkAuth, (req, res) => {
    Books.find().then((result) => {
        res.status(200).json({
            allBooks: result,
        });
    });
});

router.post("/add", (req, res, next) => {
    const book = new Books({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: {
            firstName: req.body.author.firstName,
            lastName: req.body.author.lastName,
        },
        subject: req.body.subject,
    });

    book
        .save()
        .then((result) => {
            res.status(201).json({
                message: `Book ${req.body.title} was added to library`,
            });
        })
        .catch((err) => {
            res.status(500).json({message: err});
        });
});

router.delete("/:bookId", checkAuth, (req, res, next) => {
    const {bookId} = req.params;

    Books.findByIdAndDelete(bookId)
        .then((result) => {
            res.status(200).json({
                message: `Usunieto ksiązkę o Id ${bookId} pod tytulem ${result.title}`,
            });
        })
        .catch((err) =>
            res.status(500).json({message: "Internal Server Error", error: err})
        );
});

router.put("/:bookId", checkAuth, (req, res, next) => {
    const {bookId} = req.params;

    Books.findByIdAndUpdate(bookId, {
        title: req.body.title,
        author: {
            firstName: req.body.author.firstName,
            lastName: req.body.author.lastName,
        },
        subject: req.body.subject,
    })
        .then((result) => {
            res.status(200).json({
                message: `Ksiązka o nr ${bookId} zostala zmieniona`,
                recordBeforeChange: result,
                recordAfterChange: req.body,
            });
        })
        .catch((err) => res.status(500).json({message: "Server Error"}));
});

router.get("/subject/:subject", (req, res, next) => {
    const {subject} = req.params;

    Books.find({subject: subject})
        .then((result) => {
            res.status(200).json({
                message: result,
            });
        })
        .catch((err) => res.status(500).json({message: "Server Error"}));
});

router.get("/author/:lastName", (req, res, next) => {
    const {lastName} = req.params;
    Books.find({"author.lastName": lastName})
        .then((result) => {
            if (!result.length) {
                res.status(200).json({
                    message: `Nie znaleziono autora o nazwisku  ${lastName}`,
                });
            } else {
                res.status(200).json({
                    message: result,
                    recordsFound: result.length.toString(),
                });
            }
        })
        .catch((err) => res.status(500).json({message: "Server Error"}));
});

module.exports = router;

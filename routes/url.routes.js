const express = require("express");
const router = express.Router();
const Url = require("../models/url.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");
const alert = require("alert")
const User = require("../models/user.model")
const mongoose = require("mongoose");


//?Get Full List of Urls
router.get("/api/urlList", async (req, res, next) => {
    //! I Used the find method because it retrieves every Url Document.
    try {
        const urlList = await Url.find({})
        //! Send back the json to Check in PostMan
        res.status(200).json(urlList);
    } catch (error) {
        res.status(500).json(error);
    }
})
//? Create New Short URL for non-members
router.post("/api/shortUrl", async (req, res, next) => {
    try {
        //! Req.body to get the Post Req Body
        const { fullUrl } = req.body;

        const checkUrl = await Url.findOne({ fullUrl })
        console.log("checkUrl", checkUrl)
        if (checkUrl) {
            //! My First Interpretation of Iteration #1 "The shortened version of the URL is the same for every shortening Request"
            //! Here, when I find there is a duplicate I assign the shortUrl to be the same.
            const sameShortLink = await Url.create({ fullUrl: checkUrl.fullUrl, shortUrl: checkUrl.shortUrl, views: checkUrl.views })
            res.status(201).json(sameShortLink);
            //! Applied this first then realize that it didn't make sense, because only LogIn user can see the statitics.
            //return sameShortLink
            //checkUrl.shortCount++
            //checkUrl.save()
            //if (checkUrl.shortCount > 0) {
            //    return alert(`You've shortened this Url ${checkUrl.shortCount + 1} Times!`)
            // }
        }
        //? If the document has no duplicates It just creates a brand new one.
        else {
            const createdUrl = await Url.create({ fullUrl })
            res.redirect("/")
            res.status(201).json(createdUrl);
        }
    } catch (error) {
        res.status(500).json(error);
    }

})
//? Create New Short URL for members
router.post("/api/userUrl", isAuthenticated, async (req, res, next) => {
    //! isAuthenticated checks if the user is loggedin checking the JWT Token
    try {
        //! Req.body to get the Post Req Body - In this route I also get the userIdentity coming from the payload
        //! To be able to create short Url for the User.
        const { fullUrl, userIdentity } = req.body;
        //? Checking is the Valid
        if (!mongoose.Types.ObjectId.isValid(userIdentity)) {
            res.status(400).json({ message: "Invalid object id" });
            return;
        }
        //! Checking if the Url already exists
        const checkUrl = await Url.findOne({ fullUrl })
        console.log("checkUrl", checkUrl)
        if (checkUrl) {
            //const sameShortLink = await Url.create({ fullUrl: checkUrl.fullUrl, shortUrl: checkUrl.shortUrl, views: checkUrl.views })
            //return sameShortLink
            //! Here I increase the amount of times a User has shortened a certain URL, instead of creating a copy.
            checkUrl.shortCount++
            checkUrl.save()
            //! Small pop that shows the times you have shortened that url
            if (checkUrl.shortCount > 0) {
                return alert(`You've shortened this Url ${checkUrl.shortCount + 1} Times!`)
            }
        }
        else {
            //! If the document has no duplicate, we create a new use.
            const createdUrl = await Url.create({ fullUrl, userId: userIdentity })
            //! Here we find the user that came from the payload an assign him the Url
            await User.findByIdAndUpdate(userIdentity, {
                //! Pushing into the urlData key, part of the User.Model
                $push: { urlData: createdUrl._id },
            });
            res.redirect("/")
            res.status(201).json(createdUrl);
        }
    } catch (error) {
        res.status(500).json(error);
    }

})

//? Finds the fullURL from the hashed short url
router.get("/api/:shortURL", async (req, res, next) => {
    //! ShortID comes from a dynamic route in React 
    const shortID = req.params.shortURL
    //! Here we find the document that contains the same ShortID
    const shortUrl = await Url.findOne({ shortUrl: shortID })
    //! If there is none we throw 404
    if (shortUrl == null) return res.sendStatus(404)
    //! And if we Find it, we increment the views
    shortUrl.views++
    shortUrl.save()
    //! And redirect to http protocol + fullUrl
    res.redirect("http://" + shortUrl.fullUrl)


})


module.exports = router;
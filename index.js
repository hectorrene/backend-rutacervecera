const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const port = 3000;
const authRoutes = require('./routes/authRoutes');

const corsOptions = {
  origin: ['http://localhost:8081'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);
const Bar = require("./models/Bars.model.js");
const Event = require("./models/Events.model.js");
const Favorite = require("./models/Favorites.model.js");
const menuItem = require("./models/menuItem.models.js");
const Review = require("./models/Reviews.model.js");
const User = require("./models/Users.model.js");


mongoose.connect("mongodb+srv://admin:admin12345@backenddb.mjazc36.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backenddb")
.then(() => {
    console.log("connected to mongodb");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});


app.get ('/', (req, res) => {
    res.send('Conectado a la API de ruta cervecera');
});


app.get("/api/bars", async (req, res) => {
  try {
    const bars = await Bar.find();
    res.status(200).json(bars);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los bares", error });
  }
});


app.post("/api/bars", async (req, res) => {
  try {
    const newBar = new Bar(req.body);
    await newBar.save();
    res.status(201).json(newBar);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el bar", error });
  }
});


app.put("/api/bars/:id", async (req, res) => {
  try {
    const updatedBar = await Bar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json(updatedBar);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el bar", error });
  }
});


app.delete("/api/bars/:id", async (req, res) => {
  try {
    const deletedBar = await Bar.findByIdAndDelete(req.params.id);
    if (!deletedBar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json({ message: "Bar eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el bar", error });
  }
});


app.get("/api/bars/:id", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json(bar);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el bar", error });
  }
});


app.get("/api/bars/:id/menu", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const menuItems = await menuItem.find({ bar: req.params.id });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el menú del bar", error });
  }
});


app.get("/api/bars/:id/food", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }

    const foodItems = await menuItem.find({ 
      bar: req.params.id, 
      type: "comida" 
    }).select('name description price photo type');

    if (!foodItems || foodItems.length === 0) {
      return res.status(200).json({ 
        message: "Este bar no tiene items de comida registrados",
        items: [] 
      });
    }

    res.status(200).json({
      count: foodItems.length,
      items: foodItems
    });
  } catch (error) {
    console.error("Error al obtener comida:", error);
    res.status(500).json({ 
      message: "Error al obtener la comida del bar", 
      error: error.message 
    });
  }
});


app.get("/api/bars/:id/drinks", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }

    const drinkItems = await menuItem.find({ 
      bar: req.params.id, 
      type: "bebida" 
    }).select('name description price photo type');

    if (!drinkItems || drinkItems.length === 0) {
      return res.status(200).json({ 
        message: "Este bar no tiene bebidas registradas",
        items: [] 
      });
    }

    res.status(200).json({
      count: drinkItems.length,
      items: drinkItems
    });
  } catch (error) {
    console.error("Error al obtener bebidas:", error);
    res.status(500).json({ 
      message: "Error al obtener las bebidas del bar", 
      error: error.message 
    });
  }
});


app.get("/api/bars/:id/alcohol", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }

    const alcoholItems = await menuItem.find({ 
      bar: req.params.id, 
      type: "alcohol" 
    }).select('name description price photo type alcoholPercentage volume');

    if (!alcoholItems || alcoholItems.length === 0) {
      return res.status(200).json({ 
        message: "Este bar no tiene bebidas alcohólicas registradas",
        items: [] 
      });
    }

    res.status(200).json({
      count: alcoholItems.length,
      items: alcoholItems
    });
  } catch (error) {
    console.error("Error al obtener alcohol:", error);
    res.status(500).json({ 
      message: "Error al obtener el alcohol del bar", 
      error: error.message 
    });
  }
});


app.get("/api/bars/:id/reviews", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const reviews = await Review.find({ bar: req.params.id }).populate('user', 'name photo');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las reseñas del bar", error });
  }
});


app.get("/api/bars/:id/events", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const events = await Event.find({ bar: req.params.id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los eventos del bar", error });
  }
});


app.post("/api/bars/:barId/menu", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const newMenuItem = new menuItem({
      ...req.body,
      bar: req.params.barId
    });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el item del menú", error });
  }
});


app.put("/api/bars/:barId/menu/:itemId", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const updatedMenuItem = await menuItem.findOneAndUpdate(
      { _id: req.params.itemId, bar: req.params.barId },
      req.body,
      { new: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Item del menú no encontrado" });
    }
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el item del menú", error });
  }
});


app.delete("/api/bars/:barId/menu/:itemId", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const deletedMenuItem = await menuItem.findOneAndDelete({
      _id: req.params.itemId,
      bar: req.params.barId
    });
    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Item del menú no encontrado" });
    }
    res.status(200).json({ message: "Item del menú eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el item del menú", error });
  }
});


app.get("/api/menuItems/:id", async (req, res) => {
  try {
    const menuItem = await menuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Item del menú no encontrado" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el item del menú", error });
  }
});


app.get("/api/bars/:barId/menu/:itemId", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const item = await menuItem.findOne({ 
      _id: req.params.itemId,
      bar: req.params.barId 
    });
    if (!item) {
      return res.status(404).json({ message: "Item del menú no encontrado" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el item del menú", error });
  }
});


app.get("/api/events", async (req, res) => {
  try {
    
    const events = await Event.find().populate('bar', 'name location');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los eventos", error });
  }
});


app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('bar', 'name location');
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el evento", error });
  }
});



app.post("/api/bars/:barId/events", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }

    
    if (new Date(req.body.start) >= new Date(req.body.end)) {
      return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin" });
    }

    const newEvent = new Event({
      ...req.body,
      bar: req.params.barId
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el evento", error });
  }
});


app.put("/api/bars/:barId/events/:eventId", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }

    
    if (req.body.start && req.body.end) {
      if (new Date(req.body.start) >= new Date(req.body.end)) {
        return res.status(400).json({ message: "La fecha de inicio debe ser anterior a la fecha de fin" });
      }
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.eventId, bar: req.params.barId },
      req.body,
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el evento", error });
  }
});


app.delete("/api/bars/:barId/events/:eventId", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }

    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.eventId,
      bar: req.params.barId
    });
    
    if (!deletedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json({ message: "Evento eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el evento", error });
  }
});




app.post("/api/bars/:barId/reviews", async (req, res) => {
  try {
    console.log('=== CREATE REVIEW DEBUG ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Bar ID:', req.params.barId);
    
    const { userId, rating, comment, photos } = req.body; 

    
    if (!userId) {
      console.log('ERROR: No userId provided');
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log('Step 1: Checking if user exists...');
   
    const user = await User.findById(userId);
    if (!user) {
      console.log('ERROR: User not found:', userId);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log('SUCCESS: User found:', user._id);

    console.log('Step 2: Checking if bar exists...');
   
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      console.log('ERROR: Bar not found:', req.params.barId);
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    console.log('SUCCESS: Bar found:', bar._id);

    console.log('Step 3: Checking for existing review...');
    
    const existingReview = await Review.findOne({
      user: userId,
      bar: req.params.barId
    });

    if (existingReview) {
      console.log('ERROR: Existing review found:', existingReview._id);
      return res.status(400).json({ message: "Ya has hecho una reseña para este bar" });
    }
    console.log('SUCCESS: No existing review found');

    console.log('Step 4: Creating new review...');
    
    const reviewData = {
      rating,
      comment,
      photos: photos || [], 
      user: userId,
      bar: req.params.barId,
      createdAt: new Date()
    };
    console.log('Review data to be saved:', reviewData);

    const newReview = new Review(reviewData);
    console.log('Review object created:', newReview);

    console.log('Step 5: Saving review to database...');
    await newReview.save();
    console.log('SUCCESS: Review saved with ID:', newReview._id);
    
    console.log('Step 6: Populating user data...');
    
    await newReview.populate('user', 'name photo');
    console.log('SUCCESS: Review populated');
    
    console.log('SUCCESS: Sending response');
    res.status(201).json(newReview);
  } catch (error) {
    console.error('=== REVIEW CREATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({ 
        message: "Error de validación", 
        errors: error.errors,
        details: error.message 
      });
    }
    
    if (error.name === 'CastError') {
      console.error('Cast error - Invalid ID format');
      return res.status(400).json({ 
        message: "ID inválido", 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Error al crear la reseña", 
      error: error.message,
      errorType: error.constructor.name
    });
  }
});


app.put("/api/users/:userId/reviews/:reviewId", async (req, res) => {
  try {
    const { userId, reviewId } = req.params;
    
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

   
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para editar esta reseña" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('user', 'name photo');

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error al actualizar review:', error);
    res.status(500).json({ message: "Error al actualizar la reseña", error: error.message });
  }
});


app.delete("/api/users/:userId/reviews/:reviewId", async (req, res) => {
  try {
    const { userId, reviewId } = req.params;
    
   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

   
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta reseña" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Reseña eliminada exitosamente" });
  } catch (error) {
    console.error('Error al eliminar review:', error);
    res.status(500).json({ message: "Error al eliminar la reseña", error: error.message });
  }
});



app.get("/api/users/:userId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('bar', 'name photo location')
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las reseñas del usuario", error });
  }
});


app.get("/api/users/:userId/reviews/:barId/check", async (req, res) => {
  try {
    const review = await Review.findOne({
      user: req.params.userId,
      bar: req.params.barId
    });
    
    res.status(200).json({ 
      hasReviewed: !!review,
      review: review || null
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking review status", error });
  }
});


app.get("/api/bars/:barId/reviews/stats", async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { bar: mongoose.Types.ObjectId(req.params.barId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratings: {
            $push: {
              rating: "$rating",
              createdAt: "$createdAt"
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratings.forEach(r => {
      ratingDistribution[r.rating]++;
    });

    res.status(200).json({
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error });
  }
});


app.get("/api/users/:id/reviews/count", async (req, res) => {
  try {
    const count = await Review.countDocuments({ user: req.params.id });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error getting review count", error });
  }
});


app.post("/api/users/:userId/favorites/:barId", async (req, res) => {
  try {
    const { userId, barId } = req.params;
    
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    
    const bar = await Bar.findById(barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }

    
    const existingFavorite = await Favorite.findOne({
      user: userId,
      bar: barId
    });

    if (existingFavorite) {
      return res.status(409).json({ message: "El bar ya está en favoritos" });
    }

    
    const newFavorite = new Favorite({
      user: userId,
      bar: barId,
      createdAt: new Date()
    });

    await newFavorite.save();
    
    
    await newFavorite.populate('bar');
    
    res.status(201).json({
      message: "Bar agregado a favoritos exitosamente",
      favorite: newFavorite
    });
    
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    res.status(500).json({ 
      message: "Error al agregar el bar a favoritos", 
      error: error.message 
    });
  }
});


app.delete("/api/users/:userId/favorites/:barId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await Favorite.findOneAndDelete({
      user: req.params.userId,
      bar: req.params.barId
    });
    res.status(200).json({ message: "Bar eliminado de favoritos exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el bar de favoritos", error });
  }
});


app.get("/api/users/:userId/favorites", async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.params.userId }).populate("bar");
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los favoritos del usuario", error });
  }
});


app.get("/api/users/:userId/favorites/:barId/check", async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.params.userId,
      bar: req.params.barId
    });
    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: "Error checking favorite status", error });
  }
});


app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
});


app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
});


app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
});


app.get("/api/users/:id/reviews", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("reviews");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user.reviews);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las reseñas del usuario", error });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
});


app.get("/api/users/me", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la info del usuario", error });
  }
});


app.get("/api/bars/owner/:ownerId", async (req, res) => {
  try {
    const bars = await Bar.find({ owner: req.params.ownerId });
    res.status(200).json(bars);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las barras del owner", error });
  }
});


app.get("/api/bars/owner/:ownerId/:barId", async (req, res) => {
  try {
    const bar = await Bar.findOne({ owner: req.params.ownerId, _id: req.params.barId });
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json(bar);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la info del bar del owner", error });
    }
});


app.post("/api/bars/owner/:ownerId", async (req, res) => {
  try {
    const newBar = new Bar({
      ...req.body,
      owner: req.params.ownerId
    });
    await newBar.save();
    res.status(201).json(newBar);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el bar", error });
  }
});


app.put("/api/bars/owner/:ownerId/:barId", async (req, res) => {
  try {
    const bar = await Bar.findOneAndUpdate({ owner: req.params.ownerId, _id: req.params.barId }, req.body, { new: true });
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json(bar);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el bar", error });
  }
});


app.delete("/api/bars/owner/:ownerId/:barId", async (req, res) => {
  try {
    const bar = await Bar.findOneAndDelete({ owner: req.params.ownerId, _id: req.params.barId });
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json({ message: "Bar eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el bar", error });
  }
});


app.get("/api/bars/owner/:ownerId/:barId/events", async (req, res) => {
  try {
    const events = await Event.find({ bar: req.params.barId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los eventos del bar", error });
  }
});


app.get("/api/bars/owner/:ownerId/:barId/events/:eventId", async (req, res) => {
  try {
    const event = await Event.findOne({ bar: req.params.barId, _id: req.params.eventId });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el evento", error });
  }
});


app.post("/api/bars/owner/:ownerId/:barId/events", async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      bar: req.params.barId
    });
    await newEvent.save();
    res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el evento", error });
    }
});


app.put("/api/bars/owner/:ownerId/:barId/events/:eventId", async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate({ bar: req.params.barId, _id: req.params.eventId }, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el evento", error });
  }
});


app.delete("/api/bars/owner/:ownerId/:barId/events/:eventId", async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ bar: req.params.barId, _id: req.params.eventId });
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json({ message: "Evento eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el evento", error });
    }
});


app.get("/api/bars/owner/:ownerId/:barId/menu", async (req, res) => {
  try {
    const menuItems = await menuItem.find({ bar: req.params.barId });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los items del bar", error });
  }
});

 
app.post("/api/bars/owner/:ownerId/:barId/menu", async (req, res) => {
  try {
    const newMenuItem = new menuItem({
      ...req.body,
      bar: req.params.barId
    });
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el item del bar", error });
  }
});


app.put("/api/bars/owner/:ownerId/:barId/menu/:itemId", async (req, res) => {
  try {
    const updatedMenuItem = await menuItem.findOneAndUpdate(
      { bar: req.params.barId, _id: req.params.itemId }, 
      req.body, 
      { new: true }
    );
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Item del bar no encontrado" });
    }
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el item del bar", error });
  }
});


app.delete("/api/bars/owner/:ownerId/:barId/menu/:itemId", async (req, res) => {
  try {
    const deletedMenuItem = await menuItem.findOneAndDelete(
      { bar: req.params.barId, _id: req.params.itemId }
    );
    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Item del bar no encontrado" });
    }
    res.status(200).json({ message: "Item del bar eliminado exitosamente" }); 
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el item del bar", error });
  }
});


app.get("/api/bars/owner/:ownerId/:barId/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ bar: req.params.barId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las reseñas del bar", error });
  }
});














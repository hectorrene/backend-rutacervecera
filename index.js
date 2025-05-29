const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const Bar = require("./models/Bars.models.js");
const Event = require("./models/Events.models.js");
const Favorite = require("./models/Favorites.models.js");
const menuItem = require("./models/MenuItems.models.js");
const Review = require("./models/Reviews.models.js");
const User = require("./models/Users.models.js");

//conexion a base de datos y puerto
mongoose.connect("mongodb+srv://admin:admin12345@backenddb.mjazc36.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backenddb")
.then(() => {
    console.log("connected to mongodb");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})

// mensaje inicial al abrir la API
app.get ('/', (req, res) => {
    res.send('Conectado a la API de ruta cervecera');
});

// CRUD relacionado a bares

// Jala todos los bares
app.get("/api/bars", async (req, res) => {
  try {
    const bars = await Bar.find();
    res.status(200).json(bars);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los bares", error });
  }
});

// Crear un bar
app.post("/api/bars", async (req, res) => {
  try {
    const newBar = new Bar(req.body);
    await newBar.save();
    res.status(201).json(newBar);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el bar", error });
  }
});

// Actualizar un bar
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

// Eliminar un bar
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

// información de un bar por ID
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

// menú de un bar por ID
app.get("/api/bars/:id/menu", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id).populate("menuItems");
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json(bar.menuItems);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el menú del bar", error });
  }
});

// comida de un bar por ID
app.get("/api/bars/:id/food", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id).populate("menuItems");
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const foodItems = bar.menuItems.filter(item => item.type === "comida");
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la comida del bar", error });
  }
});

// bebidas de un bar por ID
app.get("/api/bars/:id/drinks", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id).populate("menuItems");
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const drinkItems = bar.menuItems.filter(item => item.type === "bebida");
    res.status(200).json(drinkItems);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las bebidas del bar", error });
  }
});

// detalles de un item especifico del menú por ID
app.get("/api/bars/:barId/menu/:itemId", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId).populate("menuItems");
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const menuItem = bar.menuItems.find(item => item._id.toString() === req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Item del menú no encontrado" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el item del menú", error });
  }
});

// alcohol de un bar por ID
app.get("/api/bars/:id/alcohol", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id).populate("menuItems");
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const alcoholItems = bar.menuItems.filter(item => item.type === "alcohol");
    res.status(200).json(alcoholItems);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el alcohol del bar", error });
  }
});

// reseñas de un bar por ID
app.get("/api/bars/:id/reviews", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id).populate("reviews");
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json(bar.reviews);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las reseñas del bar", error });
  }
});

// eventos de un bar por ID
app.get("/api/bars/:id/events", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id).populate("events");
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    res.status(200).json(bar.events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los eventos del bar", error });
  }
});

// CRUD relacionado a menuItems

// crear un item del menú
app.post("/api/menuItems", async (req, res) => {
  try {
    const newMenuItem = new menuItem(req.body);
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el item del menú", error });
  }
});

// actualizar un item del menú
app.put("/api/menuItems/:id", async (req, res) => {
  try {
    const updatedMenuItem = await menuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Item del menú no encontrado" });
    }
    res.status(200).json(updatedMenuItem);
    } catch (error) {
    res.status(500).json({ message: "Error al actualizar el item del menú", error });
  }
});

// eliminar un item del menú
app.delete("/api/menuItems/:id", async (req, res) => {
  try {
    const deletedMenuItem = await menuItem.findByIdAndDelete(req.params.id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Item del menú no encontrado" });
    }
    res.status(200).json({ message: "Item del menú eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el item del menú", error });
  }
});

// información de un item del menú por ID
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

// CRUD relacionado a eventos

// jala todos los eventos
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los eventos", error });
  }
});

// crear un evento
app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el evento", error });
  }
});

// actualizar un evento
app.put("/api/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    } 
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el evento", error });
    }
    });

// eliminar un evento
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json({ message: "Evento eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el evento", error });
  }
});

// información de un evento por ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el evento", error });
  }
});

// CRUD relacionado a reseñas

// hacerle una reseña a un bar
app.post("/api/bars/:barId/reviews", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const newReview = new Review(req.body);
    newReview.bar = bar._id;
    await newReview.save();
    bar.reviews.push(newReview._id);
    await bar.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la reseña", error });
  }
});

// modificar una reseña
app.put("/api/reviews/:id", async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }   
    res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la reseña", error });
    }
});

// eliminar una reseña
app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }
    const bar = await Bar.findById(deletedReview.bar);
    if (bar) {
      bar.reviews.pull(deletedReview._id);
      await bar.save();
    }
    res.status(200).json({ message: "Reseña eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reseña", error });
  }
});

// agregar a favoritos un bar
app.post("/api/bars/:barId/favorites", async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.barId);
    if (!bar) {
      return res.status(404).json({ message: "Bar no encontrado" });
    }
    const newFavorite = new Favorite({
      user: req.body.user,
      bar: bar._id
    });
    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el bar a favoritos", error });
  }
});

// eliminar un bar de favoritos
app.delete("/api/bars/:barId/favorites", async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.body.user,
      bar: req.params.barId
    });
    if (!favorite) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }
    res.status(200).json({ message: "Bar eliminado de favoritos exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el bar de favoritos", error });
  }
});

// jala todos los favoritos de un usuario
app.get("/api/users/:userId/favorites", async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.params.userId }).populate("bar");
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los favoritos del usuario", error });
  }
});

// CRUD relacionado a usuarios

// crear un usuario
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
});

// actualizar un usuario por id 
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

// eliminar un usuario por id
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

// reseñas de un usuario por ID
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

//  comentarios
// mongodb+srv://admin:admin12345@backenddb.mjazc36.mongodb.net/?retryWrites=true&w=majority&appName=backenddb
// falta agregar lo de que por cualquier IP
// npm i nodemon -D
// nodemon index.js
// npm i express
// npm i mongoose
//npm i 
// npm run dev


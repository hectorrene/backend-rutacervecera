import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bar'
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// para que no haya duplicados
favoriteSchema.index({ user: 1, bar: 1 }, { unique: true, partialFilterExpression: { bar: { $exists: true } } });
favoriteSchema.index({ user: 1, menuItem: 1 }, { unique: true, partialFilterExpression: { menuItem: { $exists: true } } });

favoriteSchema.virtual('barDetails', {
  ref: 'Bar',
  localField: 'bar',
  foreignField: '_id',
  justOne: true
});

favoriteSchema.virtual('menuItemDetails', {
  ref: 'MenuItem',
  localField: 'menuItem',
  foreignField: '_id',
  justOne: true
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
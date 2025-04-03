const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

const phoneValidator = {
  validator: function (phone) {
    return /^\d{2,3}-\d+$/.test(phone);
  },
  message: (props) =>
    `${props.value} no es un numero de telefono valido. Debe tener el formato XX-XXXXXXX o XXX-XXXXXXXX.`,
};

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  phone: {
    type: String,
    minlenth: 8,
    required: true,
    validate: phoneValidator,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

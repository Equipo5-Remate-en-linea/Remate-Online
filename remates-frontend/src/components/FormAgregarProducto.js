import { useState } from "react";

export default function FormAgregarProducto() {
  const FIELDS_CLASSES = "flex flex-col items-start gap-2";
  const INPUTS_CLASSES = "border border-slate-600 rounded-sm px-2 py-1 w-full";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [auctionDuration, setAuctionDuration] = useState("");
  const [invalidInitialValue, setInvalidInitialValue] = useState(false);
  const [invalidAuctionDuration, setInvalidAuctionDuration] = useState(false);

  const handleNumberInputsChange = (e) => {
    if (e.target.name === "initialValue") {
      setInitialValue(e.target.value);
      if (Number(e.target.value) <= 0) setInvalidInitialValue(true);
      else setInvalidInitialValue(false);
    } else {
      setAuctionDuration(e.target.value);
      if (Number(e.target.value) <= 0) setInvalidAuctionDuration(true);
      else setInvalidAuctionDuration(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando...");
  };

  return (
    <form
      className="max-w-max mx-auto px-16 py-8 border rounded space-y-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      {/* nombre */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="name">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ej: Adaptador VGA a HDMI"
          className={INPUTS_CLASSES}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {/* descripcion */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Ej: Adaptador para cables VGA con salida a HDMI"
          className={INPUTS_CLASSES}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      {/* imagen */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="image">
          Imagen
        </label>
        <input
          type="file"
          id="image"
          name="image"
          className={INPUTS_CLASSES}
          onChange={(e) => console.log(e.target.files[0])}
        />
      </div>
      {/* valor inicial */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="initialValue">
          Valor inicial
        </label>
        <input
          type="number"
          id="initialValue"
          name="initialValue"
          placeholder="Ej: 12000"
          className={INPUTS_CLASSES}
          value={initialValue}
          onChange={handleNumberInputsChange}
        />
        {invalidInitialValue && (
          <p className="text-red-600">El valor ingresado no es válido</p>
        )}
      </div>
      {/* duracion del remate */}
      <div className={FIELDS_CLASSES}>
        <label className="font-semibold" htmlFor="auctionDuration">
          Duración del remate
        </label>
        <input
          type="number"
          id="auctionDuration"
          name="auctionDuration"
          className={INPUTS_CLASSES}
          value={auctionDuration}
          onChange={handleNumberInputsChange}
        />
        {invalidAuctionDuration && (
          <p className="text-red-600">El valor ingresado no es válido</p>
        )}
      </div>
      <input
        type="submit"
        value="Agregar producto"
        className="w-full color-boton text-white px-4 py-2 rounded-sm transition"
      />
    </form>
  );
}

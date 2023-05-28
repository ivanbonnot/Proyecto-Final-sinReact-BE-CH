try{

} catch (error) {
  logger.error(`Error en la solicitud de productos: ${error}`);
  return res.status(500).json({ result: "error" });
}
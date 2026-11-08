import mongoose from "mongoose";

function ensureValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("The supplied resource ID is invalid.");
    error.status = 400;
    throw error;
  }
}

export function createCrudController(Model, resourceName, fields) {
  const pick = (body) =>
    Object.fromEntries(
      fields
        .filter((key) => Object.hasOwn(body, key))
        .map((key) => [key, body[key]]),
    );
  return {
    async list(_request, response) {
      const resources = await Model.find().sort({ _id: 1 });
      response.json(resources);
    },

    async read(request, response) {
      ensureValidId(request.params.id);
      const resource = await Model.findById(request.params.id);
      if (!resource)
        return response
          .status(404)
          .json({ error: `${resourceName} not found.` });
      return response.json(resource);
    },

    async create(request, response) {
      const resource = await Model.create(pick(request.body));
      response.status(201).json(resource);
    },

    async update(request, response) {
      ensureValidId(request.params.id);
      const resource = await Model.findById(request.params.id);
      if (!resource)
        return response
          .status(404)
          .json({ error: `${resourceName} not found.` });
      Object.assign(resource, pick(request.body));
      await resource.save();
      return response.json(resource);
    },

    async remove(request, response) {
      ensureValidId(request.params.id);
      const resource = await Model.findByIdAndDelete(request.params.id);
      if (!resource)
        return response
          .status(404)
          .json({ error: `${resourceName} not found.` });
      return response.json({
        message: `${resourceName} deleted successfully.`,
      });
    },

    async removeAll(_request, response) {
      const result = await Model.deleteMany({});
      response.json({
        message: `${result.deletedCount} ${resourceName.toLowerCase()} record(s) deleted.`,
      });
    },
  };
}

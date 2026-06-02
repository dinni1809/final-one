exports.ok = (res, data) => res.status(200).json({ success: true, data });
exports.created = (res, data) => res.status(201).json({ success: true, data });

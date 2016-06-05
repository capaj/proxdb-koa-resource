const Resource = require('koa-resource-router')
const parse = require('co-body')
const pluralize = require('pluralize')

module.exports = (Model) => {
  const res = new Resource(pluralize(Model.name), {
    // GET /users
    index: function *(next) {
      this.body = Model.all()
    },
    // POST /users
    create: function *(next) {
      const json = yield parse(this)
      this.body = new Model(json)
    },
    // GET /users/:id
    show: function *(next) {
      this.body = yield Model.resolveDoc(this.params.id)
    },
    // PUT /users/:id
    update: function *(next) {
      const json = yield parse(this)
      const doc = Model.map.get(this.params.id)
      if (doc) {
        Object.assign(doc, json)
        return this.status = 200
      }
      this.status = 404
    },
    // DELETE /users/:id
    destroy: function *(next) {
      const doc = Model.map.get(this.params.id)
      if (doc) {
        doc.remove()
        return this.status = 200
      }
      this.status = 404
    }
  })
  return res.middleware()
}

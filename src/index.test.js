import assert from 'assert';
import Product from './product.js';
import Service from './service.js';

const callTracker = new assert.CallTracker()

// quando o programa terminar, valida todas as chamadas
process.on('exit', () => callTracker.verify())

// Should throw an error whendescription is less than 5 characters long
{
  const params = {
    description: 'My P',
    id: 1,
    price: 1000
  }

  const product = new Product({
    onCreate: () => { },
    service: new Service()
  })

  assert.rejects(
    () => product.create(params),
    { message: 'description mus be higher than 5' },
    'it should throw an error with wrong description'
  )
}

// Should save product successfully
{
  const params = {
    description: 'My Product',
    id: 1,
    price: 1000
  }

  // serviceStub = impedir que seja ONLINE
  const spySave = callTracker.calls(1)
  const serviceStub = {
    async save(params) {
      spySave(params)
      return `${params.id} saved with success!`
    }
  }

  const fn = (msg) => {
    assert.deepStrictEqual(msg.id, params.id, 'id shoud be the same')
    assert.deepStrictEqual(msg.price, params.price, 'price shoud be the same')
    assert.deepStrictEqual(msg.description, params.description.toUpperCase(), 'description shoud be the same')
  }
  const spyOnCreate = callTracker.calls(fn, 1)

  const product = new Product({
    onCreate: spyOnCreate,
    service: serviceStub
  })

  const result = await product.create(params)
  assert.deepStrictEqual(result, `${params.id} SAVED WITH SUCCESS!`)
}
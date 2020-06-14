let should = require('should');
let _Pool  = require('../../src/common/pool.js');
let Pool   = _Pool.default;

describe('common', function() {
    describe('pool.js', function() {
        it('should be created successfully', function() {
            let test = new Pool('test');

            test.should.be.instanceof(Pool);
        });

        it('should set key-value correctly' , function() {
            let test = new Pool('test');
            test.name.should.be.eql('test');

            let test2 = new Pool();
            test2.name.should.be.eql('pool');
        });


        it('should return exist instance when create a pool repeatedly' , function() {
            let test1 = new Pool('test1');
            let test2 = new Pool('test1');

            test1.should.be.equal(test2);
        });

        it('should set key-value successfully' , function() {
            let test = new Pool('test');

            test.set('foo', 'bar');

            test.pool.should.be.eql({ 'foo': 'bar' });
        });

        it('should get key-value successfully' , function() {
            let test = new Pool('test');

            test.set('foo', 'bar');

            test.get('foo').should.be.eql('bar');
        });

        it('should clear pool successfully' , function() {
            let test = new Pool('test');

            test.set('foo', 'bar');
            test.clear();

            test.pool.should.be.empty();
        });

        it('should clear pool successfully' , function() {
            let test = new Pool('test');

            test.set('foo', 'bar');
            const list = test.getList();

            list.should.containEql('bar');
        });
    });
});


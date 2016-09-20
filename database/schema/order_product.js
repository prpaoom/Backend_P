module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var order_product = mongoose.Schema({
    post_id: { type: Schema.Types.ObjectId, ref: 'order_product' }
    },{collection:'Bzn_order_product'});
    return order_product;
}
module.exports = function(mongoose){
    var post_photo = mongoose.Schema({},{collection:'Bzn_post_photo'});
    return post_photo;
}
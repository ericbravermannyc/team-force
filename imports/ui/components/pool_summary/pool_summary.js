import utils from './../../../../lib/utils';
import shops from './../../../../lib/shops.json';

Template.poolSummary.helpers({
    poolItems: () => {
        return utils.toArr(Pools.getGroupByItemWithData(Template.instance().data._id));
    }
});

Template.poolSummary.events({
    'click .close-pool': () => {
        const pool = Pools.findOne({ _id: Template.instance().data._id });
        Pools.changePoolState(pool._id, utils.POOL_STATE.ARCHIVED);

        const itemsToSent = utils.toArr(Pools.getGroupByItemWithData(pool._id));

        let items = itemsToSent.map((item) => {
            return {
                count: item.count,
                link: item.data.link,
                title: item.data.title
            };
        });

        const email = shops[pool.shop].email;
        if (email) {
            Meteor.call('sendEmail', email, { phone: Meteor.user().profile.phone, name: Meteor.user().profile.username }, items, pool.shop);
        }
    }
});

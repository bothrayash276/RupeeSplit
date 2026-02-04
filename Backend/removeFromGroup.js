export async function removefromGroup(userId, groupObject) {
    const {_id, ...group} = groupObject
    const member = group.members.filter(id => id!==userId)
    const grp = {
        ...group,
        "members": member
    }
    return grp
}

export async function removefromUserDB(groupId, userObject) {
    const {_id, ...user} = userObject
    const groups = user.groups.filter(id => id !== groupId)
    const userData = {
        ...user,
        "groups" : groups
    }
    return userData
}
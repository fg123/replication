#pragma once

#include "object.h"
#include "game.h"

// Holds a reference to a certain type of Object, which can be retrieved

template<class T>
class ObjectReference {
    static_assert(std::is_base_of<Object, T>::value, "ObjectRef<T> can only hold references to objects");

    ObjectID id = 0;
public:
    ObjectReference() {}
    ObjectReference(ObjectID id) : id(id) {}
    ObjectReference(const T* obj) : ObjectReference(obj->GetId()) {}

    template<class Other>
    void operator=(const ObjectReference<Other>& other) {
        static_assert(std::is_base_of<Object, Other>::value, "Cannot cast to a non-inherited object type");
        id = other.GetId();
    }

    operator bool() const {
        return id != 0;
    }

    void Set(ObjectID id) {
        this->id = id;
    }

    // Can return null, make sure to always check for existance
    T* Get(const Game& game) const {
        return game.GetObject<T>(id);
    }

    ObjectID GetId() const {
        return id;
    }

    void Reset() {
        id = 0;
    }
};
#include "ray-cast.h"
#include "object.h"

RayCastRequest::RayCastRequest() {
    inclusionTags = (uint64_t) Tag::OBJECT;
}
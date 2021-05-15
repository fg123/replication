#include "ray-cast.h"
#include "object.h"

RayCastRequest::RayCastRequest() {
    exclusionTags = (uint64_t)Tag::OBJECT;
}
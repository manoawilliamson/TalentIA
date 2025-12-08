<?php

namespace App\Validation;
use App\Models\UserModel;

class NumberRules
{
    public function number_prefix(string $tel): bool
    {
        $prefixes = ['034', '038', '032', '037', '033'];
        $prefix = substr($tel, 0, 3);
        return in_array($prefix, $prefixes);
    }
}

import pytest
from fastapi import HTTPException

from ...routers.users import _to_nullable_float, _validated_name


def test_validated_name_trims_spaces():
    assert _validated_name('  Alice  ', 'given_names') == 'Alice'


def test_validated_name_rejects_overlong_text():
    with pytest.raises(HTTPException) as exc:
        _validated_name('a' * 256, 'given_names')
    assert exc.value.status_code == 422
    assert exc.value.detail == 'given_names is too long.'


def test_to_nullable_float_allows_none():
    assert _to_nullable_float(None, 'height', 90.0, 250.0) is None


def test_to_nullable_float_returns_float_in_range():
    value = _to_nullable_float(175, 'height', 90.0, 250.0)
    assert isinstance(value, float)
    assert value == 175.0


def test_to_nullable_float_rejects_out_of_range():
    with pytest.raises(HTTPException) as exc:
        _to_nullable_float(400, 'height', 90.0, 250.0)
    assert exc.value.status_code == 422
    assert exc.value.detail == 'height must be between 90.0 and 250.0.'
